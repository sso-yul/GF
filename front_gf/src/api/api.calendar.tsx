import api from "./api";

export const saveScheduleColor = async (scheduleColorDto: { scheduleColorName: string; scheduleColor: string }) => {
    try {
        const response = await api.post("/schedule/color", scheduleColorDto);
        return response.data;
    } catch (error) {
        console.error("일정 색상 저장 실패", error);
        throw new Error("일정 색상 저장 실패");
    }
};
