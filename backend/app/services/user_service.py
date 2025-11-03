def get_user_detail(token):
    return {
        "interviews": [
            [  # Interview 1
                {
                    "interview_question": "What is your experience with Python?",
                    "interview_answer": "I have 5 years of experience with Python...",
                    "interview_feedback": {
                        "clarity_structure_score": 5,
                        "clarity_structure_feedback": "Well organized response",
                        "relevance_score": 4,
                        "relevance_feedback": "Directly addresses the question",
                        "keyword_alignment_score": 4,
                        "keyword_alignment_feedback": "Good use of technical terms",
                        "confidence_score": 5,
                        "confidence_feedback": "Confident delivery",
                        "conciseness_score": 4,
                        "conciseness_feedback": "Concise and clear",
                        "overall_summary": "Strong answer demonstrating experience",
                        "overall_score": 4.4
                    }
                },
                {
                    "interview_question": "Explain async/await in Python",
                    "interview_answer": "Async/await allows for concurrent execution...",
                    "interview_feedback": {
                        "clarity_structure_score": 4,
                        "clarity_structure_feedback": "Clear explanation",
                        "relevance_score": 5,
                        "relevance_feedback": "Very relevant",
                        "keyword_alignment_score": 5,
                        "keyword_alignment_feedback": "Excellent terminology",
                        "confidence_score": 4,
                        "confidence_feedback": "Good confidence",
                        "conciseness_score": 5,
                        "conciseness_feedback": "Very concise",
                        "overall_summary": "Excellent technical answer",
                        "overall_score": 4.6
                    }
                }
            ],
            [  # Interview 2
                {
                    "interview_question": "What are Python decorators?",
                    "interview_answer": "Decorators are functions that modify other functions...",
                    "interview_feedback": {
                        "clarity_structure_score": 5,
                        "clarity_structure_feedback": "Very clear",
                        "relevance_score": 5,
                        "relevance_feedback": "Highly relevant",
                        "keyword_alignment_score": 4,
                        "keyword_alignment_feedback": "Good keywords",
                        "confidence_score": 4,
                        "confidence_feedback": "Confident",
                        "conciseness_score": 5,
                        "conciseness_feedback": "Perfectly concise",
                        "overall_summary": "Strong understanding shown",
                        "overall_score": 4.6
                    }
                }
            ]
        ],
        "badges": [
            {
                "badge_id": 1,  # XP Badge Level 1
                "unlock_date": 1698796800
            },
            {
                "badge_id": 2,  # XP Badge Level 2
                "unlock_date": 1699401600
            },
            {
                "badge_id": 3,  # Interview Streak Badge
                "unlock_date": 1700006400
            }
        ]
    }