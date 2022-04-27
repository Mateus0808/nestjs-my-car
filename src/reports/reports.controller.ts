import { GetEstimateDto } from './dtos/get-estimate.dto';
import { AdminGuard } from './../guards/admin.guard';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { ReportDto } from './dtos/report.dto';
import { UserEntity } from './../users/user.entity';
import { AuthGuard } from './../guards/auth.guard';
import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Query,
  Get,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  async getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  async createReport(
    @Body() createReportDto: CreateReportDto,
    @CurrentUser() user: UserEntity,
  ) {
    const report = await this.reportsService.create(createReportDto, user);

    return report;
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  async approveReport(@Param('id') id: number, @Body() body: ApproveReportDto) {
    const report = await this.reportsService.changeApproval(id, body.approved);

    return report;
  }
}
