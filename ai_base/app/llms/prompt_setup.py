from operator import itemgetter
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import trim_messages
from langchain_core.runnables import RunnablePassthrough
from langchain_core.messages import HumanMessage
from .env_setup import model

prompts = {
    "general_assistant": ChatPromptTemplate.from_messages(
        [
            ("system", "You are a helpful assistant. Answer all questions to the best of your ability."),
            MessagesPlaceholder(variable_name="messages"),
        ]
    ),
    "ocr_correction": ChatPromptTemplate.from_messages(
        [
            ("system", '''
            You have following sentences extract from an OCR process. 
            You need to recognize the words/sentences that have not been correctly matched from original picture and correct the overall text.
            Generate an output including a list of unmanaged words or sentences with the correct reconstruction.
            '''),
            MessagesPlaceholder(variable_name="messages"),
        ]
    ),
    "note_template": ChatPromptTemplate.from_messages(
        [
            ("system", "You are an expert in creating structured note templates."),
            MessagesPlaceholder(variable_name="messages"),
        ]
    ),
    "idea_generator": ChatPromptTemplate.from_messages(
        [
            ("system", "You are a creative assistant who helps generate ideas."),
            MessagesPlaceholder(variable_name="messages"),
        ]
    ),
    "content_creator": ChatPromptTemplate.from_messages(
        [
            ("system", "You are an assistant that helps with writing and content creation."),
            MessagesPlaceholder(variable_name="messages"),
        ]
    ),
}

user_input_prompt = {
    "general_assistant": "You: ",
    "ocr_correction": "\nBelow the sentences to analyze:\n{sentences}",
    "note_template": "I need a {note_type} template. The template should include sections for {key_elements} and be easy to follow.",
    "idea_generator": "I am working on {project_description} and need ideas to get started.",
    "content_creator": "I need help expanding on {topic}. The content should be {tone} and focus on {points}.",
}

# Define the trimmer for message management
trimmer = trim_messages(
    max_tokens=1000,
    strategy="last",
    token_counter=model,
    include_system=True,
    allow_partial=False,
    start_on="human",
)

# Function to select the appropriate prompt
def select_prompt(prompt_type="general_assistant"):
    return prompts.get(prompt_type, prompts["general_assistant"])

# Define the chain for handling input and response, dynamically selecting the prompt
def create_chain(prompt_type="general_assistant"):
    selected_prompt = select_prompt(prompt_type)
    return (
        RunnablePassthrough.assign(messages=itemgetter("messages") | trimmer)
        | selected_prompt
        | model
    )

def create_user_prompt(params={}, prompt_type="general_assistant"):
    if not params:
        if prompt_type == "general_assistant":
            prompt_input = input("You: ")
        elif prompt_type == "ocr_correction":
            sentences = input("Enter the OCR extracted sentences to correct: ")
            params["sentences"] = sentences

        elif prompt_type == "note_template":
            note_type = input("Enter the type of note you need (e.g., meeting, study): ")
            key_elements = input("Enter the key elements/topics to include: ")
            params["note_type"] = note_type
            params["key_elements"] = key_elements

        elif prompt_type == "idea_generator":
            project_description = input("Describe the project or topic you need ideas for: ")
            params["project_description"] = project_description

        elif prompt_type == "content_creator":
            topic = input("Enter the topic or sentence you need help expanding: ")
            tone = input("Enter the tone (e.g., formal, informal, creative): ")
            points = input("Enter the points you need help with: ")
            params["topic"] = topic
            params["tone"] = tone
            params["points"] = points

    if prompt_type == "general_assistant":
        prompt_input = params['message']
        user_message = HumanMessage(content=prompt_input)
    else:
        template = user_input_prompt[prompt_type]
        formatted_message = template.format(**params)
        user_message = HumanMessage(content=formatted_message)

    return user_message

