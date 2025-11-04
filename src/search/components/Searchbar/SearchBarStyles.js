import styled from 'styled-components';

const DropDownTSP = styled.div`
position: absolute;
left: 0%;

width: 200%;

@media (max-width: 1150px) {
    width: 100%;
}

margin-top: 0.5rem;
min-width: 100%;
display: -ms-grid;
display: grid;
-ms-grid-columns: (1fr)[5];
grid-template-columns: repeat(5, 1fr);
-ms-grid-rows: -webkit-min-content;
-ms-grid-rows: min-content;
grid-template-rows: -webkit-min-content;
grid-template-rows: min-content;


-webkit-box-pack: center;
    -ms-flex-pack: center;
        justify-content: center;



border: 0.1rem solid grey;
background-color: rgba(255, 255, 255, 1) !important;
-webkit-box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.19), 0 0.3rem 0.3rem rgba(0, 0, 0, 0.23);
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.19), 0 0.3rem 0.3rem rgba(0, 0, 0, 0.23);
color: grey;

overflow-y: auto;
opacity: 1;  
  }
`;


const DropDown= styled.div`
position: absolute;
left: 50%;
-webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
        transform: translateX(-50%);
-webkit-box-sizing: border-box;
        box-sizing: border-box;
width: 80vw;

min-width: 100%;
display: -ms-grid;
display: grid;
-ms-grid-columns: (1fr)[5];
grid-template-columns: repeat(5, 1fr);
-ms-grid-rows: -webkit-min-content;
-ms-grid-rows: min-content;
grid-template-rows: -webkit-min-content;
grid-template-rows: min-content;


-webkit-box-pack: center;
    -ms-flex-pack: center;
        justify-content: center;
position: relative;

top: 0.2rem;
border: 0.1rem solid grey;
background-color: rgba(255, 255, 255, 1) !important;
-webkit-box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.19), 0 0.3rem 0.3rem rgba(0, 0, 0, 0.23);
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.19), 0 0.3rem 0.3rem rgba(0, 0, 0, 0.23);
color: grey;

overflow-y: auto;

opacity: 1;  
  }
`;


const DropDownNewSearch = styled.div`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    box-sizing: border-box;
    width: 60vw;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: min-content;

    justify-content: center;
    position: relative;
    @media only screen and (max-width: 1600px) {
        width: 90vw;
    }
    top: 0.2rem;
    border: 0.1rem solid grey;
    background-color: rgba(255, 255, 255, 1) !important;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.19),
        0 0.3rem 0.3rem rgba(0, 0, 0, 0.23);
    color: grey;

    overflow-y: auto;

    opacity: 1;
`;

const DropDownElement = styled.div`
    flex: 1;
    position: relative;
`;

const DropDownItem = styled.div`
    margin: 0.5rem 2rem 0.5rem 2rem;
`;

const DropDownItemContent = styled.div`
    display: grid;
    grid-template-columns: min-content 1fr;
    grid-template-rows: 1fr 0.2rem;

    &:hover {
        background-color: rgba(0, 0, 0, 0.3);
    }
`;

const DropDownItemIcon = styled.div`
    width: 2rem;
    padding: 1rem 1rem 1rem 1rem;
`;

const Line = styled.hr`
    width: 95%;
    border: 0;
    height: 0;
    border-top: 0.1rem solid rgba(0, 0, 0, 0.1);
    border-bottom: 0.1rem solid rgba(255, 255, 255, 0.3);
`;

const DropDownIconText = styled.div`
    display: flex;
    align-items: center;
    padding-left: 0rem;
`;

const TagInDropDown = styled.div`
    font-size: 1.6rem;
`;

const DropDownItemTitle = styled.div`
    box-sizing: border-box;
    border-bottom: 0.1rem solid rgba(0, 0, 0, 0.1);
    border-right: 0.1rem solid rgba(0, 0, 0, 0.1);
    height: 8rem;
    position: sticky;

    background-color: rgba(255, 255, 255) !important;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    @media only screen and (max-width: 1600px) {
        padding: 0 1rem 0rem 1rem;
        font-size: 1.6rem;
        font-weight: bold;
    }
    text-align: center;
    font-size: 1.8rem;
    text-transform: uppercase;
    font-weight: bold;
`;

const SearchTextBox = styled.div`
    text-align: center;
    min-width: 100rem;
    @media (max-width: 725px) {
        min-width: initial;
    }
`;


const SearchTextBoxTSP = styled.div`
    text-align: left;
   
   
`;


const SearchElementWrapper = styled.div`
    position: absolute;
    top: 35%;
    width: 100rem;
    padding: 1rem;

    box-sizing: border-box;
    @media (max-width: 725px) {
        width: initial;
    }

    @media (max-width: 1920px) {
        top: 25%;
    }
`;

const SearchElementWrapperTSP = styled.div` 

    // padding-left: 5rem;  
`;

export { DropDown, DropDownItem, SearchElementWrapper, DropDownItemTitle, DropDownElement, DropDownItemContent, DropDownItemIcon, DropDownIconText, DropDownNewSearch, SearchTextBox, TagInDropDown, Line, SearchElementWrapperTSP, DropDownTSP, SearchTextBoxTSP };

