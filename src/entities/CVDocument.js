{
  "name": "CVDocument",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Name of this CV version"
    },
    "template_id": {
      "type": "string",
      "description": "Selected template identifier"
    },
    "personal_info": {
      "type": "object",
      "properties": {
        "full_name": {
          "type": "string"
        },
        "email": {
          "type": "string"
        },
        "phone": {
          "type": "string"
        },
        "location": {
          "type": "string"
        },
        "linkedin": {
          "type": "string"
        },
        "website": {
          "type": "string"
        },
        "summary": {
          "type": "string"
        }
      }
    },
    "experiences": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "job_title": {
            "type": "string"
          },
          "company": {
            "type": "string"
          },
          "location": {
            "type": "string"
          },
          "start_date": {
            "type": "string"
          },
          "end_date": {
            "type": "string"
          },
          "is_current": {
            "type": "boolean"
          },
          "bullet_points": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      }
    },
    "education": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "degree": {
            "type": "string"
          },
          "field": {
            "type": "string"
          },
          "institution": {
            "type": "string"
          },
          "location": {
            "type": "string"
          },
          "graduation_date": {
            "type": "string"
          },
          "gpa": {
            "type": "string"
          },
          "achievements": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      }
    },
    "skills": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "category": {
            "type": "string"
          },
          "items": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      }
    },
    "certifications": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "issuer": {
            "type": "string"
          },
          "date": {
            "type": "string"
          },
          "credential_id": {
            "type": "string"
          }
        }
      }
    },
    "languages": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "language": {
            "type": "string"
          },
          "proficiency": {
            "type": "string"
          }
        }
      }
    },
    "projects": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "url": {
            "type": "string"
          },
          "technologies": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      }
    },
    "customization": {
      "type": "object",
      "properties": {
        "primary_color": {
          "type": "string"
        },
        "secondary_color": {
          "type": "string"
        },
        "font_family": {
          "type": "string"
        },
        "font_size": {
          "type": "string"
        },
        "spacing": {
          "type": "string"
        }
      }
    },
    "target_job_id": {
      "type": "string",
      "description": "ID of job offer this CV is tailored for"
    },
    "ats_score": {
      "type": "number",
      "description": "ATS compatibility score 0-100"
    },
    "job_match_score": {
      "type": "number",
      "description": "Match score against target job 0-100"
    },
    "status": {
      "type": "string",
      "enum": [
        "draft",
        "complete",
        "archived"
      ],
      "default": "draft"
    },
    "is_base_cv": {
      "type": "boolean",
      "default": false,
      "description": "Whether this is the master CV"
    }
  },
  "required": [
    "title"
  ]
}