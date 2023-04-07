import React, { useState } from "react";

function FolderTree(data) {
    const [expanded, setExpanded] = useState([]);

    const handleFolderClick = (id) => {
        if (expanded.includes(id)) {
            setExpanded(expanded.filter((item) => item !== id));
        } else {
            setExpanded([...expanded, id]);
        }
    };

    const renderNode = (node) => {
        const isExpanded = expanded.includes(node.id);

        return (
            <div key={node.id}>
                <div
                    onClick={() => node.isDirectory && handleFolderClick(node.id)}
                    style={{ paddingLeft: "20px", cursor: node.isDirectory ? "pointer" : "default" }}
                >
                    {node.isDirectory ? (isExpanded ? "📁 " : "📂 ") : "📄 "}
                    {node.name}
                </div>
                {node.isDirectory && isExpanded && node.children && (
                    <div style={{ paddingLeft: "20px" }}>{node.children.map((child) => renderNode(child))}</div>
                )}
            </div>
        );
    };

    return <div>{data.map((node) => renderNode(JSON.parse(node)))}</div>;
}

// const folderData = {
//     data: '{"name":"gitFolder","isDirectory":true,"children":[{"name":".env.example","isDirectory":false},{"name":".git","isDirectory":true,"children":[{"name":"HEAD","isDirectory":false},{"name":"config","isDirectory":false},{"name":"description","isDirectory":false},{"name":"hooks","isDirectory":true,"children":[{"name":"applypatch-msg.sample","isDirectory":false},{"name":"commit-msg.sample","isDirectory":false},{"name":"fsmonitor-watchman.sample","isDirectory":false},{"name":"post-update.sample","isDirectory":false},{"name":"pre-applypatch.sample","isDirectory":false},{"name":"pre-commit.sample","isDirectory":false},{"name":"pre-merge-commit.sample","isDirectory":false},{"name":"pre-push.sample","isDirectory":false},{"name":"pre-rebase.sample","isDirectory":false},{"name":"pre-receive.sample","isDirectory":false},{"name":"prepare-commit-msg.sample","isDirectory":false},{"name":"push-to-checkout.sample","isDirectory":false},{"name":"update.sample","isDirectory":false}]},{"name":"index","isDirectory":false},{"name":"info","isDirectory":true,"children":[{"name":"exclude","isDirectory":false}]},{"name":"logs","isDirectory":true,"children":[{"name":"HEAD","isDirectory":false},{"name":"refs","isDirectory":true,"children":[{"name":"heads","isDirectory":true,"children":[{"name":"main","isDirectory":false}]},{"name":"remotes","isDirectory":true,"children":[{"name":"origin","isDirectory":true,"children":[{"name":"HEAD","isDirectory":false}]}]}]}]},{"name":"objects","isDirectory":true,"children":[{"name":"info","isDirectory":true,"children":[]},{"name":"pack","isDirectory":true,"children":[{"name":"pack-9a553128ee26618bae8961001025ffc3e4c8048e.idx","isDirectory":false},{"name":"pack-9a553128ee26618bae8961001025ffc3e4c8048e.pack","isDirectory":false}]}]},{"name":"packed-refs","isDirectory":false},{"name":"refs","isDirectory":true,"children":[{"name":"heads","isDirectory":true,"children":[{"name":"main","isDirectory":false}]},{"name":"remotes","isDirectory":true,"children":[{"name":"origin","isDirectory":true,"children":[{"name":"HEAD","isDirectory":false}]}]},{"name":"tags","isDirectory":true,"children":[]}]}]},{"name":".gitignore","isDirectory":false},{"name":"app.js","isDirectory":false},{"name":"controllers","isDirectory":true,"children":[{"name":".gitkeep","isDirectory":false}]},{"name":"models","isDirectory":true,"children":[{"name":"DBpool.js","isDirectory":false},{"name":"cache.js","isDirectory":false},{"name":"default_db.db","isDirectory":false}]},{"name":"package-lock.json","isDirectory":false},{"name":"package.json","isDirectory":false},{"name":"views","isDirectory":true,"children":[{"name":".gitkeep","isDirectory":false}]}]}',
// };

// console.log(FolderTree({ folderData }));

export default FolderTree;
