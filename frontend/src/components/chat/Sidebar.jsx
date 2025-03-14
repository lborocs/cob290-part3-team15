import React, { useState } from 'react';

const Sidebar = ({ selectedID, setSelectedID }) => {

  //Temp
  const users = [1, 2, 3, 4, 5];

  return (
    <>
      <p className="font-bold text-lg">Direct Messages</p>
      <div className="flex flex-col px-4 space-y-2">
        {users.map((user) => (
          <button
            key={user}
            className="p-2 bg-blue-500 text-white rounded"
            onClick={() => setSelectedID(user)}
          >
            User {user}
          </button>
        ))}
      </div>

      <div className="flex flex-col mt-4">
        {/* Display selected user */}
        {selectedID !== null ? (
          <p>User: {selectedID}</p>
        ) : (
            <></>
        )}
      </div>
    </>
  );
};

export default Sidebar;
