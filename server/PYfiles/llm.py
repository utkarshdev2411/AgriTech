from langchain_community.document_loaders import JSONLoader 
from langchain_text_splitters import RecursiveCharacterTextSplitter 
from langchain_text_splitters import RecursiveJsonSplitter 
from langchain_text_splitters import CharacterTextSplitter
import json
from pathlib import Path
import getpass
import os
from dotenv import load_dotenv  # type: ignore
from langchain_community.vectorstores import FAISS 
from pprint import pprint
# import requests
from langchain_google_genai import GoogleGenerativeAIEmbeddings 
import google.generativeai as genai 
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.prompts import PromptTemplate
from langchain.chains.question_answering import load_qa_chain
from langchain_google_genai import ChatGoogleGenerativeAI
import PyPDF2


import base64 
import io 
from PIL import Image
import pdf2image



load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

#########USE OF JSONLOADER #########
file_path='./data.json'
data = json.loads(Path(file_path).read_text())
# pprint(data)


# #########USE OF JSONSPLITTER #########
# json_data = requests.get(data).json()
splitter = RecursiveJsonSplitter(max_chunk_size=300)
json_data = data
json_chunks = splitter.split_json(json_data=json_data)
docs = splitter.create_documents(texts=[json_data])
texts = splitter.split_text(json_data=json_data)
# print(texts[0])
# print(texts[1]) 


# ####USING VECTOR STORING#############
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
vector_store=FAISS.from_texts(texts,embeddings)
vector_store.save_local("faiss_index1")




######################################################## PDF CONTENT EXTRACTION ################################################

#Converting into image and then loading
pdf_path = open("./Test.pdf", 'rb')
if pdf_path is not None:
    images = pdf2image.convert_from_bytes(pdf_path.read())
    
    first_page = images[0]  # get the first page

    # convert PIL image to byte array
    img_byte_arr = io.BytesIO()
    first_page.save(img_byte_arr, format='JPEG')
    img_byte_arr = img_byte_arr.getvalue()

    pdf_parts=[
        {
            "mime_type": "image/jpeg",
            "data": base64.b64encode(img_byte_arr).decode('utf-8')
        }
 ]
else:
        raise FileNotFoundError("File not found")

embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
prompt="extract the numerical data and give the value along with its relations with other data and reelavent text.Give the response in paragraph format in upto one hundred words s the in a proper structure.   If you are not able to extract the data, just say, 'I am not able to extract the data'"

model=genai.GenerativeModel('gemini-pro-vision')
response=model.generate_content([pdf_parts[0], prompt])
print(response.text) 




text=response.text

# Splitting the text into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
chunks=text_splitter.split_text(text)
# return chunks

# Getting the vector store
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
vector_store=FAISS.from_texts(chunks,embeddings)
vector_store.save_local("faiss_index2")


########### LOAD THE FAISS INDEX AND GET THE SIMILARITY SEARCH ################

user_question = "Give summary of this data"
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")


new_db=FAISS.load_local("faiss_index1",embeddings) ###LOADING THE FAISS INDEX of JSON
docs=new_db.similarity_search(user_question)
text1=docs[0].page_content
# print(text1)

new_db=FAISS.load_local("faiss_index2",embeddings) ###LOADING THE FAISS INDEX of PDF
docs=new_db.similarity_search(user_question)
text2=docs[0].page_content
# print(text2)

text=text1+text2




# Splitting the text into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
chunks=text_splitter.split_text(text)
# return chunks

# Getting the vector store
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
vector_store=FAISS.from_texts(chunks,embeddings)
vector_store.save_local("faiss_index3")


########### LOAD THE FAISS INDEX FOR USER QUESTION ################

new_db=FAISS.load_local("faiss_index3",embeddings) ###LOADING THE FAISS INDEX of Combined JSON and PDF
docs=new_db.similarity_search(user_question)
text=docs[0].page_content
# print(text)



embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

user_question = "Should I use fertilizers for the crops or not?give few examples of the crops that require fertilizers as per my requirements."

prompt="You are agriculturist and research expert whose aim is to help the farmers to enhance their productivity by helping them in modernization and sharing scientific aspects.  if you are not able to get any contenxt from the data or not recieved any informatin, then generate your own behalf which reseblence to the query and help the farmers as much as possible. use your own nlp for the purpose. Also avoid any unnecessary information. Give the response in paragraph format in upto one hundred words in a proper structure."+" "+text+""+user_question

model=genai.GenerativeModel(model_name="models/gemini-1.5-pro-latest")
response=model.generate_content([user_question,text,prompt])

query_answer=response.text
print(response.text) 

