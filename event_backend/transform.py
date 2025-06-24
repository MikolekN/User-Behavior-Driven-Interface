import xml.etree.ElementTree as ET
import xml.dom.minidom

bpmn_file_path = "model.bpmn"
new_bpmn_file_path = "new_model.bpmn"

start_event_name = "Start Event"
end_event_name = "End Event"

ET.register_namespace("bpmn", "http://www.omg.org/spec/BPMN/20100524/MODEL")
ET.register_namespace("bpmndi", "http://www.omg.org/spec/BPMN/20100524/DI")
ET.register_namespace("omgdc", "http://www.omg.org/spec/DD/20100524/DC")
ET.register_namespace("omgdi", "http://www.omg.org/spec/DD/20100524/DI")
ET.register_namespace("xsi", "http://www.w3.org/2001/XMLSchema-instance")
ET.register_namespace("xsd", "http://www.w3.org/2001/XMLSchema")

ns = {
    "bpmn": "http://www.omg.org/spec/BPMN/20100524/MODEL",
    "bpmndi": "http://www.omg.org/spec/BPMN/20100524/DI",
    "omgdc": "http://www.omg.org/spec/DD/20100524/DC",
    "omgdi": "http://www.omg.org/spec/DD/20100524/DI",
    "xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "xsd": "http://www.w3.org/2001/XMLSchema"
}

# --- Parse BPMN ---
try:
    tree = ET.parse(bpmn_file_path)
    root = tree.getroot()
    print(f"Successfully parsed BPMN file: {bpmn_file_path}")
except FileNotFoundError:
    print(f"Error: File '{bpmn_file_path}' not found.")
    exit(1)
except ET.ParseError as e:
    print(f"Error: Invalid XML in '{bpmn_file_path}': {e}")
    exit(1)

# --- Remove bpmndi:BPMNDiagram section ---
bpmndi_diagram = root.find(".//bpmndi:BPMNDiagram", ns)
if bpmndi_diagram is not None:
    root.remove(bpmndi_diagram)
    print("Removed bpmndi:BPMNDiagram section")
else:
    print("No bpmndi:BPMNDiagram section found in the BPMN file")

# --- Set Process attributes ---
process = root.find(".//bpmn:process", ns)
if process is not None:
    process.set("isClosed", "true")
    process.set("isExecutable", "true")
    print("Set process isExecutable to true")
else:
    print("Error: No bpmn:process element found in the BPMN file")
    exit(1)

# --- Transform start event ---
start_event = root.find(".//bpmn:startEvent", ns)
if start_event is not None:
    old_name = start_event.get("name", "None")
    start_event.set("name", start_event_name)
    print(f"Changed start event name from '{old_name}' to '{start_event_name}'")
else:
    print("Warning: No bpmn:startEvent found in the BPMN file")

# --- Transform end event ---
end_event = root.find(".//bpmn:endEvent", ns)
if end_event is not None:
    old_name = end_event.get("name", "None")
    end_event.set("name", end_event_name)
    print(f"Changed end event name from '{old_name}' to '{end_event_name}'")
else:
    print("Warning: No bpmn:endEvent found in the BPMN file")

# --- Save new BPMN
xml_str = ET.tostring(root, encoding='unicode', xml_declaration=True)
dom = xml.dom.minidom.parseString(xml_str)
pretty_xml = dom.toprettyxml(indent="  ")

with open(new_bpmn_file_path, 'w', encoding='utf-8') as f:
    for line in pretty_xml.splitlines():
        if line.strip():  # Skip empty lines
            f.write(line + '\n')
print(f"Transformation complete. Saved as '{new_bpmn_file_path}'")