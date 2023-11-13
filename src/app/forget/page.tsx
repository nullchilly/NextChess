import BlackQueen from "@/components/icons/ChessPiece/BlackQueen";

export default function Login() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
        <div className="w-full p-6 bg-white rounded-md shadow-xl lg:max-w-xl border">
        <div className="flex justify-center">
            <div className="text-4xl font-extrabold text-center text-gray-800 not-italic">Next Chess</div>
            <BlackQueen width={45} height={45} />
        </div>
        <form className="mt-4">
            <div className="mb-">
            <label
              htmlFor="email"
              className="block text-lg font-bold text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              className="block w-full px-2 py-2 mt-2 mb-2 text-gray-700 bg-white border rounded-lg focus:border-gray-800 focus:ring-gray-300"
            />
          </div>
          <div className="mt-2">
            <button className="w-full mt-6 px-4 py-2 font-bold text-white bg-gray-700 rounded-md hover:bg-gray-500">
                Request to Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}