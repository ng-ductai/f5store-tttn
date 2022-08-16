import React from "react";
import { formatQueryString } from "../../../helpers";
import { SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Button, Input } from "antd";
import { Link, useLocation } from "react-router-dom";

const Search = (props) => {
  const { options, linkSearch, setLinkSearch, isSmDevice } = props;
  const initLink = "/search?keyword=";
  const locations = useLocation().pathname;

  return (
    <div className="t-right search-bar-wrapper w-100">
      <div className="search-bar pos-relative">
        <AutoComplete
          className="trans-center w-100"
          options={options}
          onChange={(value) => setLinkSearch(formatQueryString(value))}
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        >
          <Input
            maxLength={200}
            size="large"
            placeholder={!isSmDevice ? "Nhập từ khoá cần tìm" : "Tìm kiếm"}
          />
        </AutoComplete>
        <Button type="primary" size="large">
          <Link to={linkSearch === "" ? locations : initLink + linkSearch}>
            <SearchOutlined />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Search;
