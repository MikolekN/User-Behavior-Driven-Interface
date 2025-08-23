import xml
import xml.etree.ElementTree as ET
from typing import Dict
from xml.dom.minidom import Element

from config import APP_URL
from processes.helpers.generate_id import generate_id
from processes.types.graph_element import GraphElement


def generate_transformed_bpmn(transformed_map: Dict[str, GraphElement], user_id: str, output_bpmn_file_path: str,
                              visits_map: Dict, verbose: bool = False) -> None:
    ET.register_namespace("bpmn", "http://www.omg.org/spec/BPMN/20100524/MODEL")
    ET.register_namespace("bpmndi", "http://www.omg.org/spec/BPMN/20100524/DI")
    ET.register_namespace("omgdc", "http://www.omg.org/spec/DD/20100524/DC")
    ET.register_namespace("omgdi", "http://www.omg.org/spec/DD/20100524/DI")
    ET.register_namespace("xsi", "http://www.w3.org/2001/XMLSchema-instance")
    ET.register_namespace("xsd", "http://www.w3.org/2001/XMLSchema")
    ET.register_namespace("zeebe", "http://camunda.org/schema/zeebe/1.0")
    ET.register_namespace("modeler", "http://camunda.org/schema/modeler/1.0")

    ns = {
        "bpmn": "http://www.omg.org/spec/BPMN/20100524/MODEL",
        "bpmndi": "http://www.omg.org/spec/BPMN/20100524/DI",
        "omgdc": "http://www.omg.org/spec/DD/20100524/DC",
        "omgdi": "http://www.omg.org/spec/DD/20100524/DI",
        "xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "xsd": "http://www.w3.org/2001/XMLSchema",
        "zeebe": "http://camunda.org/schema/zeebe/1.0",
        "modeler": "http://camunda.org/schema/modeler/1.0"
    }

    def bpmn(tag):
        return f"{{{ns['bpmn']}}}{tag}"

    def zeebe(tag):
        return f"{{{ns['zeebe']}}}{tag}"

    attribs = {f"xmlns:{k}": v for k, v in ns.items() if k not in ["bpmn", "zeebe"]}
    attribs["targetNamespace"] = f"http://User-Behavior-Driven-Interface.bpmn/{user_id}"
    definitions = ET.Element(bpmn("definitions"), attribs)

    process = ET.SubElement(definitions, bpmn("process"), {
        "id": generate_id("Process"),
        "name": f"User Navigation Process for {user_id}",
        "processType": "None",
        "isClosed": "false",
        "isExecutable": "true",
    })

    message_refs = {}
    for elem_id, elem in transformed_map.items():
        if elem.bpmn_element_type == "intermediateCatchEvent":
            message_id = generate_id("Message")
            message_refs[elem_id] = message_id
            message_elem = ET.SubElement(definitions, bpmn("message"), {
                "id": message_id,
                "name": elem.name
            })
            message_ext = ET.SubElement(message_elem, bpmn("extensionElements"))
            ET.SubElement(message_ext, zeebe("subscription"), {"correlationKey": "=userId"})

    flow_id_map = {}
    for source_id, source_elem in transformed_map.items():
        for target_id in source_elem.outgoing_flows:
            if target_id in transformed_map:
                flow_id = generate_id("Flow")
                flow_id_map[(source_id, target_id)] = flow_id

    for elem_id, elem in transformed_map.items():
        attrib = {"id": elem.id}
        if elem.name:
            attrib["name"] = elem.name

        if elem.bpmn_element_type == "serviceTask":
            attrib.update({
                "zeebe:modelerTemplate": "io.camunda.connectors.HttpJson.v2",
                "zeebe:modelerTemplateVersion": "11",
                "zeebe:modelerTemplateIcon": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE3LjAzMzUgOC45OTk5N0MxNy4wMzM1IDEzLjQ0NzUgMTMuNDI4MSAxNy4wNTI5IDguOTgwNjUgMTcuMDUyOUM0LjUzMzE2IDE3LjA1MjkgMC45Mjc3NjUgMTMuNDQ3NSAwLjkyNzc2NSA4Ljk5OTk3QzAuOTI3NzY1IDQuNTUyNDggNC41MzMxNiAwLjk0NzA4MyA4Ljk4MDY1IDAuOTQ3MDgzQzEzLjQyODEgMC45NDcwODMgMTcuMDMzNSA0LjU1MjQ4IDE3LjAzMzUgOC45OTk5N1oiIGZpbGw9IiM1MDU1NjIiLz4KPHBhdGggZD0iTTQuOTMxMjYgMTQuMTU3MUw2Ljc4MTA2IDMuNzE0NzFIMTAuMTM3NUMxMS4xOTE3IDMuNzE0NzEgMTEuOTgyNCAzLjk4MzIzIDEyLjUwOTUgNC41MjAyN0MxMy4wNDY1IDUuMDQ3MzYgMTMuMzE1IDUuNzMzNTggMTMuMzE1IDYuNTc4OTJDMTMuMzE1IDcuNDQ0MTQgMTMuMDcxNCA4LjE1NTIyIDEyLjU4NDEgOC43MTIxNUMxMi4xMDY3IDkuMjU5MTMgMTEuNDU1MyA5LjYzNzA1IDEwLjYyOTggOS44NDU5TDEyLjA2MTkgMTQuMTU3MUgxMC4zMzE1TDkuMDMzNjQgMTAuMDI0OUg3LjI0MzUxTDYuNTEyNTQgMTQuMTU3MUg0LjkzMTI2Wk03LjQ5NzExIDguNTkyODFIOS4yNDI0OEM5Ljk5ODMyIDguNTkyODEgMTAuNTkwMSA4LjQyMzc0IDExLjAxNzcgOC4wODU2MUMxMS40NTUzIDcuNzM3NTMgMTEuNjc0MSA3LjI2NTEzIDExLjY3NDEgNi42Njg0MkMxMS42NzQxIDYuMTkxMDYgMTEuNTI0OSA1LjgxODExIDExLjIyNjUgNS41NDk1OUMxMC45MjgyIDUuMjcxMTMgMTAuNDU1OCA1LjEzMTkgOS44MDkzNiA1LjEzMTlIOC4xMDg3NEw3LjQ5NzExIDguNTkyODFaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K"
            })

        elem_node = ET.SubElement(process, bpmn(elem.bpmn_element_type), attrib)

        if elem.bpmn_element_type == "serviceTask":
            ext_elements = ET.SubElement(elem_node, bpmn("extensionElements"))
            ET.SubElement(ext_elements, zeebe("taskDefinition"), {"type": "io.camunda:http-json:1", "retries": "3"})
            io_mapping = ET.SubElement(ext_elements, zeebe("ioMapping"))
            ET.SubElement(io_mapping, zeebe("input"), {"source": "noAuth", "target": "authentication.type"})
            ET.SubElement(io_mapping, zeebe("input"), {"source": "POST", "target": "method"})
            ET.SubElement(io_mapping, zeebe("input"), {"source": ''.join((APP_URL, "userId")), "target": "url"})
            ET.SubElement(io_mapping, zeebe("input"), {"source": "=false", "target": "storeResponse"})
            ET.SubElement(io_mapping, zeebe("input"), {"source": "=20", "target": "connectionTimeoutInSeconds"})
            ET.SubElement(io_mapping, zeebe("input"), {"source": "=20", "target": "readTimeoutInSeconds"})
            ET.SubElement(io_mapping, zeebe("input"), {"source": "=false", "target": "ignoreNullValues"})
            task_headers = ET.SubElement(ext_elements, zeebe("taskHeaders"))
            ET.SubElement(task_headers, zeebe("header"), {"key": "elementTemplateVersion", "value": "11"})
            ET.SubElement(task_headers, zeebe("header"),
                          {"key": "elementTemplateId", "value": "io.camunda.connectors.HttpJson.v2"})
            ET.SubElement(task_headers, zeebe("header"), {"key": "retryBackoff", "value": "PT0S"})

        if elem.bpmn_element_type == "intermediateCatchEvent":
            ext_elements = ET.SubElement(elem_node, bpmn("extensionElements"))
            zeebe_props = ET.SubElement(ext_elements, zeebe("properties"))
            url_value = "other" if elem.name == "Navigate Other" else elem.name.replace("Navigate ",
                                                                                        "/").lower().replace(" ", "-")
            gate = transformed_map.get(next(iter(elem.incoming_flows)))
            previous = transformed_map.get(next(iter(gate.incoming_flows)))
            previous_url_value = "/dashboard" if previous.bpmn_element_type == "startEvent" else ''.join(
                ("/", previous.name.lower().replace(" ", "-")))
            if url_value != "other":
                visits = str(visits_map.get(previous_url_value, {}).get(url_value, 0))
            else:
                explicit_urls = list()
                for explicit_ids in gate.outgoing_flows:
                    if explicit_ids != elem.id:
                        explicit_urls.append(
                            transformed_map.get(explicit_ids).name.replace("Navigate ", "/").lower().replace(" ", "-"))
                visits = sum(v for k, v in visits_map.get(previous_url_value, {}).items() if k not in explicit_urls)
                visits = str(visits)
            ET.SubElement(zeebe_props, zeebe("property"), {"name": "visits", "value": visits})
            ET.SubElement(zeebe_props, zeebe("property"), {"name": "url", "value": url_value})
            ET.SubElement(zeebe_props, zeebe("property"), {"name": "previous_url", "value": previous_url_value})

        for source_id in elem.incoming_flows:
            if source_id in transformed_map:
                flow_id = flow_id_map.get((source_id, elem.id))
                if flow_id:
                    ET.SubElement(elem_node, bpmn("incoming")).text = flow_id

        for target_id in elem.outgoing_flows:
            if target_id in transformed_map:
                flow_id = flow_id_map.get((elem.id, target_id))
                if flow_id:
                    ET.SubElement(elem_node, bpmn("outgoing")).text = flow_id

        if elem.bpmn_element_type == "intermediateCatchEvent":
            message_ref = message_refs.get(elem.id)
            if message_ref:
                ET.SubElement(elem_node, bpmn("messageEventDefinition"), {
                    "id": generate_id("MessageEventDefinition"),
                    "messageRef": message_ref
                })

    for (source_id, target_id), flow_id in flow_id_map.items():
        if source_id in transformed_map and target_id in transformed_map:
            ET.SubElement(process, bpmn("sequenceFlow"), {
                "id": flow_id,
                "sourceRef": source_id,
                "targetRef": target_id
            })

    xml_str = ET.tostring(definitions, encoding="utf-8", xml_declaration=True)
    if verbose:
        print(xml_str.decode("utf-8"))
    dom = xml.dom.minidom.parseString(xml_str)
    pretty_xml = dom.toprettyxml(indent="  ")
    with open(output_bpmn_file_path, "w", encoding="utf-8") as f:
        for line in pretty_xml.splitlines():
            if line.strip():
                f.write(line + "\n")
    if verbose:
        print(f"BPMN saved to: '{output_bpmn_file_path}'")
