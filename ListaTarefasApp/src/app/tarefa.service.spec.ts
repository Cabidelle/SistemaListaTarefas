import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TarefaService, Tarefa } from './tarefa.service';

describe('TarefaService', () => {
  let service: TarefaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TarefaService]
    });
    service = TestBed.inject(TarefaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve tarefas from the API via GET', () => {
    const dummyTarefas: Tarefa[] = [
      { id: 1, nome: 'Tarefa 1', custo: 10, dataLimite: '2026-01-01', ordemApresentacao: 1 },
      { id: 2, nome: 'Tarefa 2', custo: 20, dataLimite: '2026-01-02', ordemApresentacao: 2 }
    ];

    service.getTarefas().subscribe(tarefas => {
      expect(tarefas.length).toBe(2);
      expect(tarefas).toEqual(dummyTarefas);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toBe('GET');

    req.flush(dummyTarefas);
  });

  it('should create a tarefa via POST', () => {
    const novaTarefa: Tarefa = { nome: 'Nova Tarefa', custo: 50, dataLimite: '2026-02-01' };

    service.createTarefa(novaTarefa).subscribe(tarefa => {
      expect(tarefa).toEqual(novaTarefa);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(novaTarefa);

    req.flush(novaTarefa);
  });
});