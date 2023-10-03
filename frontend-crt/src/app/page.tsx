
import AddKeyword from "@/components/AddKeyword";
import ListKeyword from "@/components/ListKeyword";


export default function Home() {


  return (
    <main className='my-10 mx-auto max-w-5xl'>
      <h1 className="text-xl">ContentSwift - Content Research Tool</h1>

      <AddKeyword />
      <ListKeyword />

    </main>
  )
}
