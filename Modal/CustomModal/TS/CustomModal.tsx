import { Modal } from '@mui/material';

interface Props {
  title?: string;
  children?: JSX.Element;
}

interface State {
  title?: string;
  child?: JSX.Element | null;
  isModalVisible?: boolean;
  onClose?: CallableFunction;
}

/**
 * @function Custom Modal
 * @description A wrapper over Mui Modal
 * ---
 * ### Benefit
 * - It can be called over onClick and without maintaining any state
 * - It doesn't re render parent to open/close a modal
 * - Easy to use!
 *
 * ### Limitation
 * - It can't be re rendered in sync with parent once opened (instead use as normal modal i.e. with state dependency)
 * ---
 * @example
 * - On Component side:
 *    // (Boiler code)
 *    const [modalRef, setModalRef] = useState<CustomModal | null>(null);
 *    return(
 *      ...
 *      <CustomModal ref={ref => modalRef(ref)} />
 *    )
 *
 *    // (onClick -- open)
 *     onClick={() => {
 *        modalRef.show({
 *          title: ''
 *          child: <div/>
 *          onClose: () => {}
 *        })
 *     }}
 *
 *     // ( -- close)
 *     modalRef.close()
 *
 *     // (Other way -- In case a component has to be open always in modal)
 *     <CustomModal> {Content} </CustomModal>
 *
 */
class CustomModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isModalVisible: Boolean(props.children),
      child: null,
      title: props.title || '',
      onClose: undefined,
    };

    this.close = this.close.bind(this);
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.title !== state.title && !!props.children) {
      return {
        title: props.title,
      };
    }
    return null;
  }

  /**
   * @function show
   * @param {object} param
   * @description show modal including child component
   */
  show({ child, title = '', onClose }: State) {
    this.setState({
      isModalVisible: true,
      child,
      title,
      onClose,
    });
  }

  /**
   * @function close
   * @description close current open modal
   */
  close() {
    this.setState({
      isModalVisible: false,
      child: <div />,
    });

    if (this.state.onClose instanceof Function) {
      this.state.onClose();
    }
  }

  render() {
    const { isModalVisible, child, title, actionsContent } = this.state;
    const { children } = this.props;

    return (
      <Modal open={isModalVisible} modalTitle={title} onClose={this.close}>
        {child || children || <div />}
      </Modal>
    );
  }
}

export default CustomModal;
