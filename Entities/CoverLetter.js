{
  "name": "CoverLetter",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "cv_id": {
      "type": "string",
      "description": "Associated CV document"
    },
    "job_id": {
      "type": "string",
      "description": "Target job offer"
    },
    "content": {
      "type": "string",
      "description": "Full cover letter text"
    },
    "tone": {
      "type": "string",
      "enum": [
        "professional",
        "enthusiastic",
        "creative",
        "formal"
      ]
    },
    "word_count": {
      "type": "number"
    },
    "template_id": {
      "type": "string"
    },
    "status": {
      "type": "string",
      "enum": [
        "draft",
        "final"
      ],
      "default": "draft"
    }
  },
  "required": [
    "title"
  ]
}