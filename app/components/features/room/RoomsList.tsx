import { IRoom } from "@/app/types";
import RoomCard from "./RoomCard";

const RoomsList = ({ rooms, userId }: { rooms: IRoom[]; userId: string })  => {
    return (
      <div
        className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 h-[70vh] rounded-2xl overflow-y-auto border border-white p-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {rooms.map((room) => (
          <RoomCard
            key={room._id.toString()}
            id={room._id.toString()}
            title={room.title}
            avatar={room.avatar}
            documentCount={room.documentIds.length}
            folders={room.folders}
            tags={room.tags}
            viewerCount={room.viewerIds.length}
            createdAt={room.createdAt}
            isOwner={room.ownerId.toString() === userId}
          />
        ))}
      </div>
    );
  }

  export default RoomsList;