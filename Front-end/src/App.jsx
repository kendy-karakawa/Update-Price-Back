import { useEffect, useState } from "react";
import UploadFile from "./components/form/UploadFile";
import Table from "./components/table/Table";
import ConnectApi from "./service/api";

export default function App() {
  const [inputOpen, setInputOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [redButton, setRedButton] = useState(false)
  const [greenButton, setGreenButton] = useState(false)


  const newUpload = ()=> {
    setInputOpen(true)
    setProducts([])
    setRedButton(false)
  }

  async function updateValues(){
    try {
      await ConnectApi.updateValues(products)
      setInputOpen(true)
      setProducts([])
      setGreenButton(false)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    const validCount = products.filter(item => item.valid).length
    setGreenButton(validCount === products.length);
    setRedButton(validCount !== products.length);
  }, [products])

  return (
    <div className="w-full h-screen p-10 bg-lime-100">
      {inputOpen && (
        <UploadFile setInputOpen={setInputOpen} setProducts={setProducts} />
      )}

      {products.length > 0 && <Table products={products} />}

    { redButton && <div className="w-full flex justify-center items-center mt-10">
      <button class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xl px-10 py-2.5 mr-2 mb-2 w-80 h-15"
      onClick={newUpload}>
        Carregar outro arquivo
      </button>
    </div>}

      {greenButton && <div className="w-full flex justify-center items-center mt-10">
        <button class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xl px-10 py-2.5 mr-2 mb-2 w-80 h-15"
        onClick={updateValues}>
          Atualizar preço
        </button>
      </div>}
    </div>
  );
}
