from detectors import network_detector


def run_detection(
    source_ip: str = "",
    destination_ip: str = "",
    destination_port: int = 0,
    protocol: str = "",
    bytes_transferred: int = 0,
    connection_frequency: int = 0,
    country: str = "",
) -> dict:
    return network_detector.detect(
        source_ip=source_ip,
        destination_ip=destination_ip,
        destination_port=destination_port,
        protocol=protocol,
        bytes_transferred=bytes_transferred,
        connection_frequency=connection_frequency,
        country=country,
    )
