from langchain_community.document_loaders import JSONLoader # type: ignore
from langchain_text_splitters import RecursiveCharacterTextSplitter # type: ignore
from langchain_text_splitters import RecursiveJsonSplitter # type: ignore
import json
from pathlib import Path
import getpass
import os
from dotenv import load_dotenv  # type: ignore
from langchain_community.vectorstores import FAISS # type: ignore
# from pprint import pprint
# import requests
from langchain_google_genai import GoogleGenerativeAIEmbeddings  # type: ignore
import google.generativeai as genai # type: ignore


load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

#########USE OF JSONLOADER #########
file_path='./data.json'
data = json.loads(Path(file_path).read_text())
# pprint(data)


#########USE OF JSONSPLITTER #########
# json_data = requests.get(data).json()
splitter = RecursiveJsonSplitter(max_chunk_size=300)
json_data = data
json_chunks = splitter.split_json(json_data=json_data)
docs = splitter.create_documents(texts=[json_data])
texts = splitter.split_text(json_data=json_data)
# print(texts[0])
# print(texts[1]) 


####USING VECTOR STORING#############
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
vector_store=FAISS.from_texts(texts,embeddings)
vector_store.save_local("faiss_index")
