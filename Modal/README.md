# CustomModal Component

Using Modal generally creates a mess inside the component (see Problem section), specially when multiple modal UIs are there. Custom Modal is just a way to simply those mess where

## Example

```js
    const [modalRef, setModalRef] = useState<CustomModal | null>(null);
    // or you can use 'useRef' as well
    // const modalRef = useRef<CustomModal | null>(null);

    const showUserName = () => {
        modalRef.show({
            title: 'User Data'
            child: <div>{UserName}</div>
            onClose: modalRef.close()
        })
    }

    const showUserEmail = () => {
        modalRef.show({
            title: 'User Data'
            child: <div>{UserEmail}</div>
            onClose: modalRef.close()
        })
    }

    return (<>
        // ...
        <CustomModal ref={ref => modalRef(ref)} />
    </>)

    // Other way of using this modal
    <CustomModal> {Content} </CustomModal>
```

## Problems cantered

1. Maintaining a state to toggle visibility.
2. onClick (modal toggler event) function and modal UI are disconnected and so it is problematic to find which UI is associated with which onClick, mostly when you have multiple modal UIs.
3. Just because of using a state for modal visibility, our parent component gets re render.
4. [not for all] Need to write all basic boiler code every time we use Modal

## Solution

Using a ref based solution to use Modal and move all the basic boiler code inside customModal component.

## Code walkthrough

- <CustomModal ref={ref => modalRef(ref)} /> --> this mounts a modal in DOM with visibility as false.
- modalRef is the ref to the Modal in the dom and using we can append the UI.
- modalRef.show is a function which updates the state of CustomModal with all the provided params (UI, title, )

## Note

- CustomModal is a class based component, as I have face some issue while using functional component, thought those issue can be fixed using 'forwardRef'.
- It can't re rendered in sync with parent once opened (instead use as normal modal i.e. <Modal>{UI}</Modal>)
