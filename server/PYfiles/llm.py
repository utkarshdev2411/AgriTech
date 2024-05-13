from langchain_community.document_loaders import JSONLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_text_splitters import RecursiveJsonSplitter
import json
from pathlib import Path
from pprint import pprint

import requests

file_path='./data.json'`
data = json.loads(Path(file_path).read_text())
# pprint(data)




# This is a large nested json object and will be loaded as a python dict
# json_data = requests.get(data).json()
splitter = RecursiveJsonSplitter(max_chunk_size=300)
json_data = data

# Recursively split json data - If you need to access/manipulate the smaller json chunks
json_chunks = splitter.split_json(json_data=json_data)

# The splitter can also output documents
docs = splitter.create_documents(texts=[json_data])

# or a list of strings
texts = splitter.split_text(json_data=json_data)

print(texts[0])
# print(texts[1]) 