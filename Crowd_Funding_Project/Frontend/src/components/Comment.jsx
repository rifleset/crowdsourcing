import React from 'react';
import '../styles/Comment.css';

function Comment({ comment,key }) {
    return (
        <div className="comment">
            <img src={`http://localhost:5000/img/${comment.author.image}`} alt={comment.author.username} className="comment-author-image" />
            <div>
                <span className='comment-author-name'
                >{comment.author.username}</span>
                <span
                    style={{ color: 'gray', fontSize: '12px' }}
                >&nbsp; says</span>
                <div className="comment-content"
                >{comment.content}</div>
            </div>
        </div>
    );
}

export default Comment;