import { useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";

export default function ProblemDetail() {
  const { id } = useParams(); // Grabs the problem ID from the URL

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <div className="w-1/2 p-6 border-r border-gray-700">
        <h1 className="text-2xl font-bold mb-4">Problem #{id} Description</h1>
        <p className="text-gray-400">Problem text and test cases will go here.</p>
      </div>
      <div className="w-1/2 p-6">
        <CodeEditor 
        language="cpp" 
        value="int main() { return 1; }" 
        onChange={(val) => console.log(val)}
        
        // Now you can pass your custom arguments!
        theme="light"
        height="400px"
        fontSize={18}
        readOnly={true}
        />
      </div>
    </div>
  );
}