import { Button, Comment, Rate } from "antd";
import { DEFAULT_USER_AVT } from "../../../../constants/index";
import { convertRateToText, formatDate } from "../../../../helpers";
import React, { useState } from "react";

const UserComment = (props) => {
  const { comment } = props;
  const { author, time, rate, content } = comment;
  const { name, avt } = author;
  const isReduceCmt = content.length >= 200 ? true : false;
  const [isMore, setIsMore] = useState(false);

  return (
    <>
      <Comment
        author={<b className="fullname">{name}</b>}
        avatar={<img src={avt !== "" ? avt : DEFAULT_USER_AVT} alt={name} />}
        content={
          <>
            {rate !== -1 && (
              <>
                <Rate
                  defaultValue={rate + 1}
                  disabled
                  style={{ fontSize: 16 }}
                />
                <h3 className="font-size-16px">{convertRateToText(rate)}</h3>
              </>
            )}

            <p className="t-justify font-size-16px">
              {isMore ? content : content.slice(0, 200)}
              {isReduceCmt && (
                <Button type="link" onClick={() => setIsMore(!isMore)}>
                  {isMore ? "Thu gọn" : "Xem thêm"}
                </Button>
              )}
            </p>
          </>
        }
        datetime={<span className="dateCmt">{formatDate(time)}</span>}
      />
    </>
  );
};

export default UserComment;
