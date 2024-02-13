import bg_img from "../assets/images/grass.jpg";
import cloud1 from "../assets/images/cloud1.png";
import cloud2 from "../assets/images/cloud2.png";

function Layout({ children }) {
  return (
    <div className="bg-custom overflow-x-hidden overflow-y-hidden relative">
      <img
        src={bg_img}
        className="w-screen h-36 bottom-0 left-0 absolute z-0"
        alt="background"
      />
      <img
        src={cloud1}
        alt="a cloud"
        className="h-[27vh] absolute w-auto custom-animation-cloud1"
      />
      <img
        src={cloud2}
        alt="a cloud"
        className="h-[33vh] absolute w-auto custom-animation-cloud2"
      />
      <div className="relative z-[100] h-screen w-screen overflow-x-hidden overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export default Layout;
