import React from 'react';
import { Tag } from 'primereact/tag';

const TagTemplate = () => {
    return (
        <div className=''>
            <Tag style={{ background: 'linear-gradient(-225deg,#33C 0%,#66F 10%,#1201FF 100%)',cursor:"pointer" }}>
                <div className="flex align-items-center ">
                    <span className="text-base">23</span>

                </div>
            </Tag>
            

        </div>

    );
}
export default TagTemplate