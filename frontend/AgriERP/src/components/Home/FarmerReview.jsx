function FarmerReview() {
  return (
    <>
      <div className="  lg:min-h-[28rem] pt-16 pb-32 lg:pt-16 px-3 md:px-10 lg:px-4 xl:px-28 2xl:62px bg-gradient-to-br from-[#a8e6cf] to-[#dcedc1]">
        <h1 className="font-bold text-2xl lg:text-3xl xl:text-4xl text-center">
          What Farmers Say
        </h1>
        <div className="feature-cards flex mt-14 gap-6 flex-wrap">
          <div className="card shadow-lg shadow-gray-300 p-5 rounded-md  flex flex-col min-w-[228px] flex-1  bg-gray-50 hover:scale-105 hover:shadow-gray-400">
            <div className="flex ">
              <div className="bg-green-200  w-14 h-14 rounded-full mt-2">
                <img
                  src="./src/assets/user.jpeg"
                  alt=""
                  srcSet=""
                  className="w-full h-full"
                />
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold mt-2">John Smith</h1>
                <p className="mt-1 text-gray-500">Farmer</p>
              </div>
            </div>
            <p className="mt-5">
              AgriERP has transformed how I manage my dairy farm. The real-time
              tracking and analytics have helped increase our productivity by
              40%.
            </p>
          </div>
          <div className="card shadow-lg shadow-gray-300 p-5 rounded-md  flex flex-col min-w-[228px] flex-1  bg-gray-50 hover:scale-105 hover:shadow-gray-400">
            <div className="flex ">
              <div className="bg-green-200  w-14 h-14 rounded-full mt-2">
                <img
                  src="./src/assets/user.jpeg"
                  alt=""
                  srcSet=""
                  className="w-full h-full"
                />
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold mt-2">John Smith</h1>
                <p className="mt-1 text-gray-500">Farmer</p>
              </div>
            </div>
            <p className="mt-5">
              AgriERP has transformed how I manage my dairy farm. The real-time
              tracking and analytics have helped increase our productivity by
              40%.
            </p>
          </div>
          <div className="card shadow-lg shadow-gray-300 p-5 rounded-md  flex flex-col min-w-[228px] flex-1  bg-gray-50 hover:scale-105 hover:shadow-gray-400">
            <div className="flex ">
              <div className="bg-green-200  w-14 h-14 rounded-full mt-2">
                <img
                  src="./src/assets/user.jpeg"
                  alt=""
                  srcSet=""
                  className="w-full h-full"
                />
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold mt-2">John Smith</h1>
                <p className="mt-1 text-gray-500">Farmer</p>
              </div>
            </div>
            <p className="mt-5">
              AgriERP has transformed how I manage my dairy farm. The real-time
              tracking and analytics have helped increase our productivity by
              40%.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
export default FarmerReview;
