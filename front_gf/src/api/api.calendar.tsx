import api from "./api";
import { ScheduleColorDto, ScheduleDto } from "../stores/types";

export const saveScheduleColor = async (name: string, color: string): Promise<ScheduleColorDto> => {
    try {
        const response = await api.post("/schedule/color", {
            scheduleColorName: name,
            scheduleColor: color
        });
        return response.data;
    } catch (error) {
        console.error("일정 색상 저장 실패", error);
        throw new Error("일정 색상 저장 실패");
    }
};

export const getScheduleColor = async (): Promise<ScheduleColorDto[]> => {
    try {
        const response = await api.get("/schedule/colors");
        return response.data;
    } catch (error) {
        console.error("일정 분류 불러오지 못함");
        throw error;
    }
}

export const saveSchedule = async (scheduleData: ScheduleDto): Promise<ScheduleDto> => {
    try {
        const response = await api.post("/schedule/save", scheduleData);
        return response.data;
    } catch (error) {
        console.error("일정 저장 실패");
        throw error;
    }
}

export const modifySchedule = async (scheduleNo: number, scheduleData: ScheduleDto): Promise<ScheduleDto> => {
    try {
        const response = await api.put(`/schedule/modify?scheduleNo=${scheduleNo}`, scheduleData);
        return response.data;
    } catch (error) {
        console.error("일정 수정 실패");
        throw error;
    }
}

export const getSchedule = async (start: Date, end: Date): Promise<ScheduleDto[]> => {
    try {
        const response = await api.get("/schedule/list", { params: { start, end } });
        return response.data;
    } catch (error) {
        console.error("일정 불러오지 못함");
        throw error;
    }
}