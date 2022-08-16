import React from "react";
import PropTypes from "prop-types";

const Posts = (props) => {
  const { content } = props;

  return (
    <div className="post">
      {content == null ? (
        <h3 className="post-update">Thông tin đang được cập nhật</h3>
      ) : (
        <>
          <p className="post-title">{content.title}</p>
          {content.desc &&
            content.desc.map((item, index) => (
              <div key={index}>
                <p className="post-content">{item.content}</p>
                <img
                  className="trans-margin post-img"
                  src={item.photo}
                  alt="img"
                />
              </div>
            ))}
        </>
      )}
    </div>
  );
};

Posts.propTypes = {
  content: PropTypes.object,
};

export default Posts;
