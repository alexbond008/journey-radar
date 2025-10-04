import api from './api';

export const promptService = {
  async sendPrompt(params?: {
    prompt?: string;
  }): Promise<string> {
    console.log('promptService.sendPrompt called with params:', params);
    const response = await api.get<string>('/info/prompt', { params });
    console.log('API response:', response.data);
    const answer = response.data;
    console.log('Mapped events:', response.data);
    return answer;
  },

};