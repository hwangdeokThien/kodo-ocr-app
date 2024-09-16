from .chat_history import get_session_history
from .prompt_setup import create_chain, create_user_prompt
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.messages import HumanMessage

class LLMTrigger:
    def __init__(self, session_id="s1", prompt_type="general_assistant"):
        self.messages_history = None
        self.prompt_type = prompt_type
        self.chain = create_chain(prompt_type=prompt_type)
        self.with_message_history = RunnableWithMessageHistory(
            self.chain,
            lambda session_id: get_session_history(session_id, prompt_type),
            input_messages_key="messages",
        )
        self.session_history = get_session_history(session_id, prompt_type)
        self.config = {"configurable": {"session_id": "s1"}}
        
    def get_messages_history(self):
        formated_messages = []
        for message in self.session_history.messages:
            role = "User" if isinstance(message, HumanMessage) else "Chatbot"
            formated_messages.append(f"{role}: {message.content}")
        return formated_messages
    
    def invoke(self, params):
        user_message = create_user_prompt(params, prompt_type=self.prompt_type)
        response = self.with_message_history.invoke(
            {
                "messages": self.session_history.messages + ([user_message] if user_message else []),
            },
            config=self.config,
        )
        return response.content