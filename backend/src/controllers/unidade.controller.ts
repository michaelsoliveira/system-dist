import { UnidaEscolarType, UnidadeService } from "../services/unidade.service";
import { Request, Response } from "express";
export class UnidadeController {
    constructor(private readonly unidadeService: UnidadeService) {}

    async listUnidades(request: Request, response: Response) {
        const { page, limit, orderBy, order, search } = request.query as {
            page?: string;
            limit?: string;
            orderBy?: string;
            order?: 'asc' | 'desc';
            search?: string;
        };
        try {
            const unidades = await this.unidadeService.listUnidades({
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 10,
                orderBy: orderBy ?? 'nome',
                order: order ? order : 'asc' as const,
                search: search ?? ''
            });

            response.status(200).json({
                unidades
            });
        } catch (error) {
            response.status(500).json({
                message: error instanceof Error ? error.message : 'Erro ao listar unidades',
                error: error
            });
        }
    }

    async createUnidade(request: Request, response: Response) {
        try {
            const { nome, logradouro, numero, bairro, municipio, estado } = request.body as UnidaEscolarType;
            const unidade = await this.unidadeService.createUnidade({ nome, logradouro, numero, bairro, municipio, estado });
            response.status(201).json({
                unidade
            });
        } catch (error: any) {
            response.status(500).json({
                message: error instanceof Error ? error.message : error.message.toString(),
                error: error
            });
        }
    }

    async updateUnidade(request: Request, response: Response) {
        const { id } = request.params as { id: string };
        const { nome, logradouro, numero, bairro, municipio, estado } = request.body as UnidaEscolarType;
        const unidade = this.unidadeService.updateUnidade(id, { nome, logradouro, numero, bairro, municipio, estado });
        response.status(200).json({
            unidade
        });
    }   

    async getUnidadeById(request: Request, response: Response) {
        const user = request.user;
        console.log('User making the request:', user);
        const { id } = request.params as { id: string };
        const unidade = await this.unidadeService.getUnidadeById(id);
        response.status(200).json({
            unidade
        });
    }

    async deleteUnidade(request: Request, response: Response) {
        const { id } = request.params as { id: string };
        await this.unidadeService.deleteUnidade(id);
        response.status(200).json({
            message: 'Unidade deletada com sucesso'
        });
    }
}