import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
    INSERT_TABLE_COMMAND,
    TableCellNode,
    TableNode,
    TableRowNode,
} from '@lexical/table';
import {createContext, useContext, useEffect, useMemo, useState} from 'react';

import Button from '../ui/Button';
import {DialogActions} from '../ui/Dialog';
import TextInput from '../ui/TextInput';


export const CellContext = createContext(null);

export function TableContext({children}) {
    const [contextValue, setContextValue] = useState({
        cellEditorConfig: null,
        cellEditorPlugins: null,
    });

    return (
        <CellContext.Provider
            value={useMemo(
                () => ({
                    cellEditorConfig: contextValue.cellEditorConfig,
                    cellEditorPlugins: contextValue.cellEditorPlugins,
                    set: (cellEditorConfig, cellEditorPlugins) => {
                        setContextValue({cellEditorConfig, cellEditorPlugins});
                    },
                }),
                [contextValue.cellEditorConfig, contextValue.cellEditorPlugins],
            )}>
            {children}
        </CellContext.Provider>
    );
}

export function InsertTableDialog({
                                      activeEditor,
                                      onClose,
                                  }) {
    const [rows, setRows] = useState('5');
    const [columns, setColumns] = useState('5');
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        const row = Number(rows);
        const column = Number(columns);
        if (row && row > 0 && row <= 500 && column && column > 0 && column <= 50) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [rows, columns]);

    const onClick = () => {
        console.log("hello oooooo")
        activeEditor.dispatchCommand(INSERT_TABLE_COMMAND, {
            columns,
            includeHeaders: true,
            rows,
        });

        onClose();
    };

    return (
        <>
            <TextInput
                placeholder={'# of rows (1-500)'}
                label="Rows"
                onChange={setRows}
                value={rows}
                data-test-id="table-modal-rows"
                type="number"
            />
            <TextInput
                placeholder={'# of columns (1-50)'}
                label="Columns"
                onChange={setColumns}
                value={columns}
                data-test-id="table-modal-columns"
                type="number"
            />
            <DialogActions data-test-id="table-model-confirm-insert">
                <Button disabled={isDisabled} onClick={onClick}>
                    Confirm
                </Button>
            </DialogActions>
        </>
    );
}

export function TablePlugin({
                                cellEditorConfig,
                                children,
                            }) {
    const [editor] = useLexicalComposerContext();
    const cellContext = useContext(CellContext);
    useEffect(() => {
        if (!editor.hasNodes([TableNode, TableRowNode, TableCellNode])) {
            throw new Error(
                'Internal Lexical error: invariant() is meant to be replaced at compile ' +
                'time. There is no runtime version. Error: '
            );
        }
    }, [editor]);
    useEffect(() => {
        cellContext.set(cellEditorConfig, children);
    }, [cellContext, cellEditorConfig, children]);
    return null;
}
