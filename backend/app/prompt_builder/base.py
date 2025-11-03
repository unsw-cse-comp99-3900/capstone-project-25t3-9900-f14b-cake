class PromptBuilder:
    """Base class for all prompt builders."""

    def __init__(self, job_description: str):
        self.job_description = job_description.strip()

    def build_prompt(self, question_type: str) -> str:
        raise NotImplementedError("Subclasses must implement build_prompt()")