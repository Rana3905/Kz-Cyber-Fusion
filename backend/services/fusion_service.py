from fusion.incident_builder import build_incident


def run_correlation(
    detector_results: dict,
    affected_entity: dict,
    incident_id: str = None,
) -> dict:
    return build_incident(
        detector_results=detector_results,
        affected_entity=affected_entity,
        incident_id=incident_id,
    )
