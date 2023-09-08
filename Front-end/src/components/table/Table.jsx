import Tbody from "./Tbody";


export default function Table({products}){

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
        <table className="w-full text-lg text-left text-gray-500 ">
          <thead className="text-lg text-gray-700 uppercase bg-blue-300">
            <tr>
              <th scope="col" className="px-6 py-3 text-center">
                Codigo
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Nome
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Preço atual
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Novo preço
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-center">
              Regra quebrada
              </th>
            </tr>
          </thead>
          {products.map((el) => (
            <Tbody
              key={el.id}
              data={el}
            />
          ))}
        </table>
      </div>
    )
}