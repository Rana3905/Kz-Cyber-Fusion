import json
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"


def load_scenario() -> dict:
    with open(DATA_DIR / "demo_scenario.json", "r", encoding="utf-8") as f:
        return json.load(f)


def get_step(step_number: int) -> dict:
    scenario = load_scenario()
    steps = scenario.get("steps", [])
    for step in steps:
        if step.get("step") == step_number:
            return step
    return {}


def get_affected_entity() -> dict:
    scenario = load_scenario()
    return scenario.get("affected_entity", {})


def get_all_steps() -> list:
    scenario = load_scenario()
    return scenario.get("steps", [])
