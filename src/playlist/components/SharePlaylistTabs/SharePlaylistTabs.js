import React from "react";
import TabHeaderItemWrapper from "../../../branding/componentWrapper/TabWrapper/TabHeaderItemWrapper";
import TabHeaderWrapper from "../../../branding/componentWrapper/TabWrapper/TabHeaderWrapper";
import useTabWrapper from "../../../branding/componentWrapper/TabWrapper/Hooks/useTabWrapper";
import AddGeneralLinkModalTab from "../PlaylistMembers/AddGeneralLinkModal/AddGeneralLinkModalTab";
import AddNewMemberCombinedModalTab from "../PlaylistMembers/AddNewMemberCombinedModal/AddNewMemberCombinedModalTab";

const SharePlaylistTabs = ({
  playlistIdProp,
  closeHandlerProp,
  ShareGeneralLink,
}) => {
  const { value, handleChange } = useTabWrapper();

  return (
    <>
      <TabHeaderWrapper value={value} onChange={handleChange}>
        <TabHeaderItemWrapper label="Share by Mail" index={0} />
        {ShareGeneralLink && (
          <TabHeaderItemWrapper label="Share by Link" index={1} />
        )}
      </TabHeaderWrapper>
      {value === 0 && (
        <AddNewMemberCombinedModalTab
          playlistIdProp={playlistIdProp}
          closeHandlerProp={closeHandlerProp}
        />
      )}

      {value === 1 && ShareGeneralLink && (
        <AddGeneralLinkModalTab
          playlistIdProp={playlistIdProp}
          closeHandlerProp={closeHandlerProp}
        />
      )}
    </>
  );
};

export default SharePlaylistTabs;
