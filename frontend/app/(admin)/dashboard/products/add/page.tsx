import ProductForm from '@/components/admin/addproduct/ProductForm'


export default function Page() {

  return (
      <div className="container mx-auto w-4/6 mt-10  border-2 border-black p-4 rounded-4xl">
        <h1 className="text-2xl font-bold mb-4">Add Product</h1>
        <ProductForm />
      </div>
  
  )

}