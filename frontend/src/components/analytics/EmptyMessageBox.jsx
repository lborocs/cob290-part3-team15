import React from "react";

function EmptyMessageBox({ message }) {
    return(
        <div className="flex items-center justify-between p-6 bg-secondary/50 rounded-3xl col-span-4 row-span-2 h-full">
            <p>{message}</p>
        </div>
    );
}

export default EmptyMessageBox;