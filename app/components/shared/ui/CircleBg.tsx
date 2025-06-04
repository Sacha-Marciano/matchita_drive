export default function CircleBg() {
    return (
      <div className="w-full h-full absolute top-0 left-0 right-0 bottom-0 -z-10 overflow-hidden">
        <div className="h-[235px] w-[235px] rounded-full bg-matchita-300 absolute top-10 right-20" />
        <div className="h-[135px] w-[135px] rounded-full bg-matchita-700 absolute bottom-60 left-20" />
        <div className="h-[400px] w-[400px] rounded-full bg-matchita-900 absolute -bottom-10 left-20 -z-10" />
        <div className="h-[100px] w-[100px] rounded-full bg-matchita-500 absolute top-32 left-1/2 -translate-x-1/2" />
        <div className="h-[300px] w-[300px] rounded-full bg-matchita-300 absolute -top-20 left-1/4 -z-20" />
        <div className="h-[150px] w-[150px] rounded-full bg-matchita-600 absolute bottom-20 right-32 z-0" />
        <div className="h-[90px] w-[90px] rounded-full bg-matchita-400 absolute top-[60%] left-[60%]" />
        <div className="h-[220px] w-[220px] rounded-full bg-matchita-400 absolute bottom-5 left-[45%] -translate-x-1/2 z-[-1]" />
      </div>
    );
  }
  