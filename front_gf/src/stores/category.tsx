export const categoryMap: { [key: string]: number } = {
    "Basic": 1,
    "Character": 2,
    "Chatter": 3,
    "Picture": 4,
    "Thread": 5
};

export const categoryNameMap: { [key: number]: string } = {
    1: "Basic",
    2: "Character",
    3: "Chatter",
    4: "Picture",
    5: "Thread"
};

export const templateOptions = Object.keys(categoryMap);