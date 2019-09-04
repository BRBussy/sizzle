
export const drawerWidth = 260

export const drawerMiniWidth = 80

export const transition = {
    transition: "all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
}

export const containerFluid = {
    paddingRight: "15px",
    paddingLeft: "15px",
    marginRight: "auto",
    marginLeft: "auto",
    "&:before,&:after": {
        display: "table",
        content: '" "'
    },
    "&:after": {
        clear: "both" as "both"
    }
}

export const boxShadow = {
    boxShadow:
        "0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
}

export const defaultBoxShadow = {
    border: "0",
    borderRadius: "3px",
    boxShadow:
        "0 10px 20px -12px rgba(0, 0, 0, 0.42), 0 3px 20px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
    padding: "10px 0",
    transition: "all 150ms ease 0s"
}

export const primaryBoxShadow = {
    boxShadow:
        "0 12px 20px -10px rgba(156, 39, 176, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(156, 39, 176, 0.2)"
}

export const infoColor = "#00acc1"