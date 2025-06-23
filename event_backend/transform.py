import xml.etree.ElementTree as ET
import re
import xml.dom.minidom
import uuid

bpmn_file_path = "model.bpmn"
new_bpmn_file_path = "new_model.bpmn"

# Register namespaces
ET.register_namespace("bpmn", "http://www.omg.org/spec/BPMN/20100524/MODEL")
ET.register_namespace("bpmndi", "http://www.omg.org/spec/BPMN/20100524/DI")
ET.register_namespace("omgdc", "http://www.omg.org/spec/DD/20100524/DC")
ET.register_namespace("omgdi", "http://www.omg.org/spec/DD/20100524/DI")
ET.register_namespace("xsi", "http://www.w3.org/2001/XMLSchema-instance")
ET.register_namespace("xsd", "http://www.w3.org/2001/XMLSchema")
ET.register_namespace("zeebe", "http://camunda.org/schema/zeebe/1.0")

tree = ET.parse(bpmn_file_path)
root = tree.getroot()
ns = {
    "bpmn": "http://www.omg.org/spec/BPMN/20100524/MODEL",
    "bpmndi": "http://www.omg.org/spec/BPMN/20100524/DI",
    "omgdc": "http://www.omg.org/spec/DD/20100524/DC",
    "omgdi": "http://www.omg.org/spec/DD/20100524/DI",
    "xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "xsd": "http://www.w3.org/2001/XMLSchema",
    "zeebe": "http://camunda.org/schema/zeebe/1.0"
}

def sanitize_name(name):
    name = re.sub(r'[^a-zA-Z0-9]', '_', name)
    if name and name[0].isdigit():
        name = '_' + name
    return name

def sanitize_correlation_key(name):
    # Replace hyphens with underscores for valid FEEL expression
    name = re.sub(r'[-]', '_', name)
    return name

# Set isExecutable="true" on the process
process = root.find(".//bpmn:process", ns)
if process is not None:
    process.set("isExecutable", "true")
    print("Set process isExecutable to true")

# Keep track of added message IDs to avoid duplicates
added_messages = set()

for gateway in root.findall(".//bpmn:exclusiveGateway", ns) + root.findall(".//bpmn:eventBasedGateway", ns):
    gateway_id = gateway.get("id")
    print(f"Analyzing gateway: {gateway_id}")

    # Ensure gateway is event-based
    gateway.tag = f"{{{ns['bpmn']}}}eventBasedGateway"
    print(f"  -> Changed to eventBasedGateway.")

    outgoing_flows = gateway.findall("bpmn:outgoing", ns)
    print(f"  -> Found {len(outgoing_flows)} outgoing flow(s).")

    # If fewer than 2 outgoing flows, add a default path
    if len(outgoing_flows) < 2:
        print(f"  -> Gateway has {len(outgoing_flows)} outgoing flows, adding default path.")
        default_catch_id = f"catch_default_{gateway_id}"
        default_message_id = f"msg_default_{gateway_id}"
        default_flow_id = f"new_default_{gateway_id}"
        default_event_name = f"Default_Event_{gateway_id}"
        sanitized_default_event_name = sanitize_correlation_key(default_event_name)

        # Create default intermediate catch event
        catch_event = ET.SubElement(process, f"{{{ns['bpmn']}}}intermediateCatchEvent",
                                    id=default_catch_id, name=default_event_name)
        ET.SubElement(catch_event, f"{{{ns['bpmn']}}}messageEventDefinition",
                      messageRef=default_message_id)
        print(f"      -> Created default catch event: {default_catch_id} with messageRef: {default_message_id}")

        # Add default message definition
        if default_message_id not in added_messages:
            diagram = root.find(".//bpmndi:BPMNDiagram", ns)
            message_elem = ET.Element(f"{{{ns['bpmn']}}}message", id=default_message_id, name=default_event_name)
            extensions = ET.SubElement(message_elem, f"{{{ns['bpmn']}}}extensionElements")
            subscription = ET.SubElement(extensions, f"{{{ns['zeebe']}}}subscription")
            subscription.set("correlationKey", f"={sanitized_default_event_name}")
            if diagram is not None:
                root.insert(list(root).index(diagram), message_elem)
            else:
                root.append(message_elem)
            added_messages.add(default_message_id)
            print(f"  -> Added default message definition: {default_message_id} with zeebe:subscription correlationKey: ={sanitized_default_event_name}")

        # Add sequence flow from gateway to default catch event
        ET.SubElement(process, f"{{{ns['bpmn']}}}sequenceFlow",
                      id=default_flow_id, sourceRef=gateway_id, targetRef=default_catch_id)
        ET.SubElement(gateway, f"{{{ns['bpmn']}}}outgoing").text = default_flow_id
        print(f"      -> Created default sequence flow: {default_flow_id}")

    for flow in outgoing_flows[:]:
        flow_id = flow.text
        print(f"    -> Processing outgoing flow: {flow_id}")

        sequence = root.find(f".//bpmn:sequenceFlow[@id='{flow_id}']", ns)
        target_id = sequence.get("targetRef")
        target_element = root.find(f".//*[@id='{target_id}']", ns)
        event_name = target_element.get("name")
        if not event_name or event_name.strip() == "":
            event_name = f"Event_{target_id}"
        sanitized_event_name = sanitize_name(event_name)
        print(f"      -> Target element: {target_id} with name: {sanitized_event_name}")

        catch_id = f"catch_{flow_id}"
        catch_event = ET.SubElement(process, f"{{{ns['bpmn']}}}intermediateCatchEvent",
                                    id=catch_id, name=sanitized_event_name)
        message_id = f"msg_{sanitized_event_name}"
        ET.SubElement(catch_event, f"{{{ns['bpmn']}}}messageEventDefinition",
                      messageRef=message_id)
        print(f"      -> Created catch event: {catch_id} with messageRef: {message_id}")

        # Add message definition if not already added
        if message_id not in added_messages:
            diagram = root.find(".//bpmndi:BPMNDiagram", ns)
            message_elem = ET.Element(f"{{{ns['bpmn']}}}message", id=message_id, name=sanitized_event_name)
            extensions = ET.SubElement(message_elem, f"{{{ns['bpmn']}}}extensionElements")
            subscription = ET.SubElement(extensions, f"{{{ns['zeebe']}}}subscription")
            subscription.set("correlationKey", f"={sanitized_event_name}")
            if diagram is not None:
                root.insert(list(root).index(diagram), message_elem)
            else:
                root.append(message_elem)
            added_messages.add(message_id)
            print(f"  -> Added message definition: {message_id} with zeebe:subscription")

        new_flow_id = f"new_{flow_id}"
        ET.SubElement(process, f"{{{ns['bpmn']}}}sequenceFlow",
                      id=new_flow_id, sourceRef=gateway.get("id"), targetRef=catch_id)
        print(f"      -> Created new sequence flow: {new_flow_id}")

        sequence.set("sourceRef", catch_id)
        sequence.set("targetRef", target_id)
        print(f"      -> Updated original sequence flow {flow_id}")

        flow.text = new_flow_id

# Write the XML to a string first
xml_str = ET.tostring(root, encoding='unicode', xml_declaration=True)

# Parse with minidom and pretty-print
dom = xml.dom.minidom.parseString(xml_str)
pretty_xml = dom.toprettyxml(indent="  ")

# Write to file, removing extra blank lines
with open(new_bpmn_file_path, 'w', encoding='utf-8') as f:
    for line in pretty_xml.splitlines():
        if line.strip():  # Skip empty lines
            f.write(line + '\n')

print(f"Transformation complete. Saved as '{new_bpmn_file_path}'.")