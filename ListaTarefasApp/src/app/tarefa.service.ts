import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Tarefa {
  id?: number;
  nome: string;
  custo: number;
  dataLimite: string;
  ordemApresentacao?: number;
}

@Injectable({ providedIn: 'root' })
export class TarefaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTarefas(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(this.apiUrl);
  }

  createTarefa(tarefa: Tarefa): Observable<Tarefa> {
    return this.http.post<Tarefa>(this.apiUrl, tarefa);
  }

  updateTarefa(tarefa: Tarefa): Observable<any> {
    return this.http.put(`${this.apiUrl}/${tarefa.id}`, tarefa);
  }

  deleteTarefa(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  reordenar(id: number, direcao: 'cima' | 'baixo'): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/mover/${direcao}`, {});
  }
}