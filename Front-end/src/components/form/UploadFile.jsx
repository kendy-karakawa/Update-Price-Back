import { useState } from "react";
import Papa from "papaparse";
import ConnectApi from "../../service/api";
import { BsCloudUpload } from "react-icons/bs";


export default function UploadFile({setInputOpen, setProducts}) {
  const [file, setFile] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    if (!file) return;
    setInputOpen(false)

    const reader = new FileReader();
    
    reader.onload = function (event) {
      Papa.parse(event.target.result, {
        delimiter: ",",
        header: true,
        skipEmptyLines: "greedy",
        dynamicTyping: true,
        complete: async function (results) {
          console.log(results.data);
          
          try {
            const data = await ConnectApi.validate(results.data)
            setProducts(data.data)
        } catch (error) {
            console.log(error)
            setInputOpen(true)
        }
        },
      });
    };
    
    reader.readAsText(file);
    
   
  
    
  }

  

  return (
    <div className="w-full h-screen p-10 bg-lime-100">
      <form
        onSubmit={onSubmit}
        className="w-full flex flex-col items-center justify-center overflow-auto"
      >
        <div className="flex items-center justify-center w-6/12">
          <label
            className="flex flex-col items-center justify-center w-6/12 h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 "
          >
            <BsCloudUpload className="text-5xl"/>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
           
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span>
              </p>
              <p className="text-xs text-gray-500">
                CSV file
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
        </div>

        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 w-3/12 mt-5"
        >
          Carregar
        </button>
      </form>
    </div>
  );
}
