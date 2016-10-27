import React, {
  Component
} from 'react'
import CDN from '../widgets/cdn'
import stateToHTML from '../utils/stateToHTML'
import {
  AtomicBlockUtils,
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  Entity,
} from 'draft-js'
import Dropzone from 'react-dropzone'

export default class  extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editorState: EditorState.createEmpty(),
        }
        this.onChange = editorState => this.setState({ editorState })
        this.focus = () => this.refs.editor.focus()
        this.handleKeyCommand = this._handleKeyCommand.bind(this)

        //行内,块儿样式
        this.toggleBlockType = (type) => this._toggleBlockType(type)
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style)
    }
    _handleKeyCommand(command) {
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
        if (newState) {
            this.onChange(newState)
            return true
        }
        return false
    }
    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        )
    }
    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }
    render() {
        const {editorState} = this.state;
        let className = 'edit-editor'
        let contentState = editorState.getCurrentContent()
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className = ' edit-hidePlaceholder'
            }
        }
        return (
            <div style={styles.root}>
                <div className={className} onClick={this.focus}>
                    <Editor
                        editorState={this.state.editorState}
                        handleKeyCommand={this.handleKeyCommand}
                        onChange={this.onChange}
                        placeholder="Enter some text..."
                        ref="editor"
                    />
                </div>
                <InlineStyleControls
                    editorState={editorState}
                    onToggle={this.toggleInlineStyle}
                />
                <BlockStyleControls
                    editorState={editorState}
                    onToggle={this.toggleBlockType}
                />
                <div style={styles.editControls}>
                    <span style={styles.editBtn} onClick={() => console.log('link')}>
                        <i className="fa fa-link"></i>
                    </span>
                    <Dropzone style={styles.editBtn} accept="image/*" onDrop={() => console.log('img')}>
                        <i className="fa fa-camera-retro"></i>
                    </Dropzone>
                    <span style={styles.editBtn} onClick={() => console.log('camera')}>
                        <i className="fa fa-video-camera"></i>
                    </span>
                </div>
            </div>
        )
    }
}
const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle()
    return (
        <div style={styles.editControls}>
        {
            INLINE_STYLES.map((inline,index) =>
                <StyleButton
                    key={index}
                    onToggle={props.onToggle}
                    active={currentStyle.has(inline.type)}
                    label={inline.label}
                    style={inline.type}
                    class={inline.classes}
                />
            )
        }
        </div>
    );
};

const BlockStyleControls = (props) => {
    const {editorState} = props
    const selection = editorState.getSelection()
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType()

    return (
        <div style={styles.editControls}>
            {
                BLOCK_TYPES.map((block,index) =>
                    <StyleButton
                        key={index}
                        onToggle={props.onToggle}
                        active={block.type === blockType}
                        label={block.label}
                        style={block.type}
                        class={block.classes}
                    />
                )
            }
        </div>
    )
};
class StyleButton extends Component {
    constructor() {
        super()
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }
    render() {
        let styleName = this.props.active ? styles.editBtnActive : styles.editBtn
        return (
            <div style={styleName} onMouseDown={this.onToggle}>
                {
                    this.props.class ? (<i className={this.props.class}></i>) : (<span>{this.props.label}</span>)
                }
            </div>
        )
    }
}

const INLINE_STYLES = [
    {label: 'Bold', type: 'BOLD',classes:'fa fa-bold'},
    {label: 'Italic', type: 'ITALIC',classes:'fa fa-italic'},
    {label: 'Underline', type: 'UNDERLINE',classes:'fa fa-underline'},
];
const BLOCK_TYPES = [
    {label: 'H1', type: 'header-one'},
    {label: 'H2', type: 'header-two'},
    {label: 'Ul', type: 'unordered-list-item',classes:'fa fa-list'},
    {label: 'Ol', type: 'ordered-list-item',classes:'fa fa-list-ol'},
    {label: 'Quote', type: 'blockquote',classes:'fa fa-quote-left'},
];



const styles = {
    root: {
        fontFamily: '\'Georgia\', serif',
        background: '#fff',
        fontSize: 16,
        padding: 15,
    },
    buttons: {
        marginBottom: 10,
    },
    editControls: {
        fontSize: 14,
        marginBottom: 5,
        userSelect: 'none',
        display: 'inline-flex',
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editBtn: {
        color: '#999',
        cursor: 'pointer',
        marginRight: 16,
        padding: '2px 0',
        display: 'inline-block',
    },
    editBtnActive: {
        color: '#5890ff',
        cursor: 'pointer',
        marginRight: 16,
        padding: '2px 0',
        display: 'inline-block',
    },
    urlInputContainer: {
        marginBottom: 10,
    },
    urlInput: {
        fontFamily: '\'Georgia\', serif',
        marginRight: 10,
        padding: 3,
    },
    editor: {
        border: '1px solid #ccc',
        cursor: 'text',
        minHeight: 80,
        padding: 10,
    },
    button: {
        marginTop: 10,
        textAlign: 'center',
    },
    media: {
        width: '100%',
    },
}
      
      



