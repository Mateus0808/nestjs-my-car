import { UserEntity } from './../users/user.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportEntity } from './report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportEntity)
    private reportRepo: Repository<ReportEntity>,
  ) {}

  async create(createReportDto: CreateReportDto, user: UserEntity) {
    const report = this.reportRepo.create({ ...createReportDto, user });

    return this.reportRepo.save(report);
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.reportRepo.findOne({
      where: { id },
    });

    if (!report) throw new NotFoundException('Report not found');

    report.approved = approved;

    return await this.reportRepo.save(report);
  }

  async createEstimate({
    make,
    model,
    long,
    lat,
    year,
    mileage,
  }: GetEstimateDto) {
    return await this.reportRepo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('long - :long BETWEEN -5 AND 5', { long })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawMany();
  }
}
