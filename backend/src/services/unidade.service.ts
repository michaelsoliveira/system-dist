import { PrismaClient, UnidadeEscolar, Prisma } from '@prisma/client';
import { z } from 'zod';

const unidadeSchema = z.object({
  nome: z
  .string()
  .min(3, 'O campo nome deve ter no minímo 3 carateres'),
  logradouro: z.string().min(5, 'O campo logradouro deve ter no minímo 5 carateres'),
  numero: z.string().nullable(),
  bairro: z.string().nullable(),
  municipio: z.string().nullable(),
  estado: z.string().nullable(),
});

type ListUnidadesParams = {
    page?: number;
    limit?: number;
    orderBy?: string;
    order?: 'asc' | 'desc';
    search?: string;
};

export type UnidaEscolarType = z.infer<typeof unidadeSchema>;

export class UnidadeService {
    constructor(private readonly prisma: PrismaClient) {}

    async listUnidades(params: ListUnidadesParams): Promise<UnidadeEscolar[]> {
        const { page = 1, limit = 10, orderBy = 'nome', order = 'asc', search } = params;
        const skip = (page - 1) * limit;
        
        let where: Prisma.UnidadeEscolarWhereInput = {};
        if (search) {
            where = { 
                nome: { 
                    contains: search,
                    mode: Prisma.QueryMode.insensitive
                },
            };
        }
        
        const unidades = await this.prisma.unidadeEscolar.findMany({
            include: {
                turmas: true
            },
            where,
            orderBy: {
                [orderBy]: order
            },
            skip,
            take: limit
        });
        return unidades;
    }

    async createUnidade(unidadeData: UnidaEscolarType): Promise<UnidadeEscolar> {
        const validatedUnidade = unidadeSchema.safeParse(unidadeData);
        if (!validatedUnidade.success) {
            throw new Error(validatedUnidade.error.message);
        }
        const unidade = await this.prisma.unidadeEscolar.create({
            data: unidadeData
        });

        return unidade;
    }

    async getUnidadeById(id: string): Promise<UnidadeEscolar | null> {
        const unidade = await this.prisma.unidadeEscolar.findUnique({
            where: { id }
        });
        return unidade;
    }

    async updateUnidade(id: string, unidadeData: UnidaEscolarType): Promise<UnidadeEscolar> {
        const validatedUnidade = unidadeSchema.safeParse(unidadeData);
        if (!validatedUnidade.success) {
            throw new Error(validatedUnidade.error.message);
        }
        const unidade = await this.prisma.unidadeEscolar.update({
            where: { id },
            data: unidadeData
        });

        return unidade;
    }

    async deleteUnidade(id: string): Promise<void> {
        await this.prisma.unidadeEscolar.delete({
            where: { id }
        });
    }
}