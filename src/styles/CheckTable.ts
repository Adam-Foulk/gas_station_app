export const checkStylesForPrint = `
.CheckTable {
    background-color: #ffffff;
    color: #000000;
    padding: 10px;
    font-family: sans-serif;
    font-size: 14pt;
}

.CheckTable .Common {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 10px;
}

.CheckTable .Common > div {
    display: flex;
    justify-content: space-between;
}


.CheckTable table {
    width: 100%;
}

.CheckTable table  th {
    text-align: left;
    font-weight: bold;
}
`;
