import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

# Load environment variables (e.g., OpenAI API key)
load_dotenv()

# Initialize OpenAI model
model = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.7)

# MongoDB URI
MONGO_URI = os.getenv("MONGO_URI")