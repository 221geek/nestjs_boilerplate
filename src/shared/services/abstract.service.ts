import {
	Document,
	FilterQuery,
	FlattenMaps,
	Model,
	Require_id,
	SortOrder,
} from "mongoose";
import { PaginationQueryDto } from "../dto/pagination-query.dto";
import { PaginatedResult } from "../interfaces/paginated-result.interface";

type LeanDoc<T> = Require_id<FlattenMaps<Omit<T, keyof Document>>>;

export abstract class AbstractService<T extends Document> {
	constructor(protected readonly model: Model<T>) {}

	async create(data: Partial<T>): Promise<T> {
		return this.model.create({ ...data, tenantId: this.getTenantId() });
	}

	async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
		return this.model
			.find({ ...filter, tenantId: this.getTenantId(), deleted: { $ne: true } })
			.lean();
	}

	async findOne(filter: FilterQuery<T>): Promise<T | null> {
		return this.model.findOne({
			...filter,
			tenantId: this.getTenantId(),
			deleted: { $ne: true },
		});
	}

	async findById(id: string): Promise<T | null> {
		return this.model.findOne({
			_id: id,
			tenantId: this.getTenantId(),
			deleted: { $ne: true },
		});
	}

	async update(id: string, data: Partial<T>): Promise<T | null> {
		return this.model.findOneAndUpdate(
			{ _id: id, tenantId: this.getTenantId(), deleted: { $ne: true } },
			data,
			{ new: true }
		);
	}

	async softDelete(id: string): Promise<void> {
		await this.model.findOneAndUpdate(
			{ _id: id, tenantId: this.getTenantId() },
			{ deleted: true, deletedAt: new Date() }
		);
	}

	async paginate(
		query: PaginationQueryDto,
		filter: FilterQuery<T> = {}
	): Promise<PaginatedResult<LeanDoc<T>>> {
		const { page = 1, limit = 10, orderBy, order = "asc" } = query;
		const skip = (page - 1) * limit;

		const baseFilter = {
			...filter,
			tenantId: this.getTenantId(),
			deleted: { $ne: true },
		};

		const sort: { [key: string]: SortOrder } = {};
		if (orderBy) {
			sort[orderBy] = order as SortOrder;
		}

		const [data, totalItems] = await Promise.all([
			this.model.find(baseFilter).sort(sort).skip(skip).limit(limit).lean(),
			this.model.countDocuments(baseFilter),
		]);

		const totalPages = Math.ceil(totalItems / limit);

		return {
			data,
			meta: {
				totalItems,
				totalPages,
				currentPage: page,
				pageSize: limit,
			},
		};
	}

	protected getTenantId(): string {
		return "default-tenant";
	}
}
