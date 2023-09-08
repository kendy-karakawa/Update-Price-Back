import Check from "../icons/Check";
import ErrorIcon from "../icons/Error";


export default function Tbody({data}) {
  const {product_code, name, sales_price, new_price, valid, error} = data


  return (
    <tbody>
      <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
        <td className="px-6 py-4 text-center text-gray-900 whitespace-nowrap bg-gray-50">
          {product_code}
        </td>
        <td className="px-6 py-4 text-center text-gray-900"> {name} </td>
        <td className="px-6 py-4 text-center text-gray-900 bg-gray-50">
          {sales_price }
        </td>
        <td className="px-6 py-4 text-center text-gray-900">{new_price}</td>
        <td className="px-6 py-4 flex items-center justify-center text-gray-900  bg-gray-50">{valid ? <Check/> : <ErrorIcon/>}</td>
        <td className="px-6 py-4 text-center text-gray-900">{error}</td>
      </tr>
    </tbody>
  );
}
